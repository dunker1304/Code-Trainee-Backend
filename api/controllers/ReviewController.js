var moment = require("moment");

module.exports = {
  getLastReviewers: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let requestReview = await RequestReview.find({
        where: {
          exerciseId: exerciseId,
        },
        sort: "updatedAt DESC",
      })
        .limit(1)
        .populate("details");
      res.json({
        success: true,
        data: requestReview,
      });
    } catch (e) {
      res.json({
        success: false,
        code: 500,
      });
      console.log(e);
    }
  },

  getRequestReview: async (req, res) => {
    try {
      let { requestId } = req.params;
      let requestReview = await RequestReview.findOne({
        id: requestId,
        isAccepted: "waiting",
      }).populate("details");
      if (requestReview) {
        let exerciseInfos = await Exercise.findOne({
          id: requestReview.exerciseId,
        })
          .populate("tags")
          .populate("testCases")
          .populate("codeSnippets");
        exerciseInfos.createdAt = moment(
          new Date(exerciseInfos.createdAt).toISOString()
        ).format();
        exerciseInfos.updatedAt = moment(
          new Date(exerciseInfos.updatedAt).toISOString()
        ).format();
        let mappingPromises = [...exerciseInfos.codeSnippets].map(async (t) => {
          let lang = await ProgramLanguage.findOne({ id: t.programLanguageId });
          return {
            sampleCode: t.sampleCode,
            languageName: lang.name,
            id: t.id,
            isActive: t.isActive,
          };
        });
        let codeSnippets = await Promise.all(mappingPromises);
        exerciseInfos.codeSnippets = [...codeSnippets].filter(
          (t) => t.isActive
        );
        res.json({
          success: true,
          data: { ...requestReview, exerciseInfos: exerciseInfos },
        });
      } else {
        res.json({
          success: false,
          code: 404,
        });
      }
    } catch (e) {
      res.json({
        success: false,
        code: 500,
      });
      console.log(e);
    }
  },

  getExerciseReview: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let exerciseInfos = await Exercise.findOne({
        id: exerciseId,
      })
        .populate("tags")
        .populate("testCases")
        .populate("codeSnippets");
      exerciseInfos.createdAt = moment(
        new Date(exerciseInfos.createdAt).toISOString()
      ).format();
      exerciseInfos.updatedAt = moment(
        new Date(exerciseInfos.updatedAt).toISOString()
      ).format();
      let mappingPromises = [...exerciseInfos.codeSnippets].map(async (t) => {
        let lang = await ProgramLanguage.findOne({ id: t.programLanguageId });
        return {
          sampleCode: t.sampleCode,
          languageName: lang.name,
          id: t.id,
          isActive: t.isActive,
        };
      });
      let codeSnippets = await Promise.all(mappingPromises);
      exerciseInfos.codeSnippets = [...codeSnippets].filter((t) => t.isActive);
      res.json({
        success: true,
        data: { ...exerciseInfos },
      });
    } catch (e) {
      res.json({
        success: false,
        code: 500,
      });
      console.log(e);
    }
  },

  review: async (req, res) => {
    try {
      await sails.getDatastore().transaction(async (db) => {
        let { comment, isAccepted, exerciseId, userId, requestId } = req.body;
        // mean self-review
        if (!!exerciseId) {
          let requestReview = await RequestReview.find({
            where: {
              exerciseId: exerciseId,
            },
            sort: "updatedAt DESC",
          })
            .limit(1)
            .usingConnection(db);
          await RequestReview.updateOne({
            id: requestReview.id,
          })
            .set({
              isAccepted: isAccepted ? "accepted" : "rejected",
            })
            .usingConnection(db);
          await Exercise.updateOne({
            id: exerciseId,
          })
            .set({
              isApproved: isAccepted ? "accepted" : "rejected",
            })
            .usingConnection(db);
          res.json({
            success: true,
          });
        } else {
          let requestReview = await RequestReview.findOne({
            id: requestId,
          })
            .populate("details")
            .usingConnection(db);
          let numberReviewers = requestReview.details.length;
          await DetailReview.updateOne({
            requestId: requestId,
            reviewer: userId,
          })
            .set({
              comment: comment,
              isAccepted: isAccepted ? "accepted" : "rejected",
            })
            .usingConnection(db);
          let stillWaitingReview = await DetailReview.find({
            requestId: requestId,
            isAccepted: "waiting",
          }).usingConnection(db);
          // if everyone reviewed
          if (stillWaitingReview.length === 0) {
            let acceptedReview = await DetailReview.find({
              requestId: requestId,
              isAccepted: "accepted",
            }).usingConnection(db);
            if (acceptedReview.length === numberReviewers) {
              await RequestReview.updateOne({
                id: requestReview.id,
              })
                .set({
                  isAccepted: "accepted",
                })
                .usingConnection(db);
              await Exercise.updateOne({
                id: exerciseId,
              })
                .set({
                  isApproved: "accepted",
                })
                .usingConnection(db);
            } else {
              await RequestReview.updateOne({
                id: requestReview.id,
              })
                .set({
                  isAccepted: "rejected",
                })
                .usingConnection(db);
              await Exercise.updateOne({
                id: exerciseId,
              })
                .set({
                  isApproved: "rejected",
                })
                .usingConnection(db);
            }
          }
          res.json({ success: true });
        }
      });
    } catch (e) {
      res.json({
        success: false,
        code: 500,
      });
      console.log(e);
    }
  },
};
