var moment = require("moment");

module.exports = {
  getLastReviewers: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let requestReview = await RequestReview.find({
        where: {
          exerciseId: exerciseId,
        },
        sort: "createdAt DESC",
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
      let { userId } = req.query;
      if (
        !requestId ||
        requestId === "" ||
        (requestId !== undefined && Number.isNaN(Number(requestId)))
      ) {
        res.json({
          success: false,
          code: 404,
        });
        return;
      }
      let requestReview = await RequestReview.findOne({
        id: requestId,
        isAccepted: "waiting",
      }).populate("details");
      if (requestReview) {
        let exerciseInfos = await Exercise.findOne({
          id: requestReview.exerciseId,
          isDeleted: false,
        })
          .populate("tags")
          .populate("testCases")
          .populate("codeSnippets");
        if (exerciseInfos) {
          let detail = await DetailReview.findOne({
            requestId: requestReview.id,
            reviewer: userId,
          });
          if (!detail) {
            res.json({
              success: false,
              code: 403,
            });
            return;
          }
          if (detail.isAccepted !== "waiting") {
            res.json({
              success: false,
              code: 404,
            });
            return;
          }
          exerciseInfos.createdAt = moment(
            new Date(exerciseInfos.createdAt).toISOString()
          ).format();
          exerciseInfos.updatedAt = moment(
            new Date(exerciseInfos.updatedAt).toISOString()
          ).format();
          let mappingPromises = [...exerciseInfos.codeSnippets].map(
            async (t) => {
              let lang = await ProgramLanguage.findOne({
                id: t.programLanguageId,
              });
              return {
                sampleCode: t.sampleCode,
                languageName: lang.name,
                id: t.id,
                isActive: t.isActive,
              };
            }
          );
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

  // get infor exercise to self-review
  getExerciseReview: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let { userId } = req.query;
      if (
        !exerciseId ||
        exerciseId === "" ||
        (exerciseId !== undefined && Number.isNaN(Number(exerciseId)))
      ) {
        res.json({
          success: false,
          code: 404,
        });
        return;
      }
      let exerciseInfos = await Exercise.findOne({
        id: exerciseId,
        isDeleted: false,
        isApproved: "waiting",
      })
        .populate("tags")
        .populate("testCases")
        .populate("codeSnippets");
      if (!exerciseInfos) {
        res.json({
          success: false,
          code: 404,
        });
        return;
      }
      //console.log({ userId: userId, createdBy: exerciseInfos.createdBy });
      if (exerciseInfos.createdBy !== Number(userId)) {
        res.json({
          success: false,
          code: 403,
        });
        return;
      }
      exerciseInfos.createdAt = moment(
        new Date(exerciseInfos.createdAt).toISOString()
      ).format();
      exerciseInfos.updatedAt = moment(
        new Date(exerciseInfos.updatedAt).toISOString()
      ).format();
      let mappingSnippetPromises = [...exerciseInfos.codeSnippets].map(
        async (t) => {
          let lang = await ProgramLanguage.findOne({ id: t.programLanguageId });
          return {
            sampleCode: t.sampleCode,
            languageName: lang.name,
            id: t.id,
            isActive: t.isActive,
          };
        }
      );
      let codeSnippets = await Promise.all(mappingSnippetPromises);
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
        let { comment, isAccepted, userId, requestId } = req.body;
        if (
          !requestId ||
          requestId === "" ||
          (requestId !== undefined && Number.isNaN(Number(requestId)))
        ) {
          res.json({
            success: false,
            code: 0,
            data: { message: "not found" },
          });
          return;
        }
        let requestReview = await RequestReview.findOne({
          id: requestId,
        })
          .populate("details")
          .usingConnection(db);
        if (!requestReview) {
          res.json({
            success: false,
            code: 0,
            data: { message: "not found" },
          });
          return;
        }
        let exercise = await Exercise.findOne({
          id: requestReview.exerciseId,
        });
        if (!exercise) {
          res.json({
            success: false,
            code: 0,
            data: { message: "not found" },
          });
          return;
        }
        if (exercise.isDeleted) {
          res.json({
            success: false,
            code: 3,
            data: { message: "exercise was deleted" },
          });
          return;
        }
        if (requestReview.isAccepted !== "waiting") {
          res.json({
            success: false,
            code: 1,
            data: {
              message: "already self-reviewed",
              isAccepted: requestReview.isAccepted,
            },
          });
          return;
        }
        let isAuthorize =
          requestReview.details.filter(
            (t) => Number(t.reviewer) === Number(userId)
          ).length === 0
            ? false
            : true;
        if (!isAuthorize) {
          res.json({
            success: false,
            code: 2,
            data: { message: "not authorized" },
          });
          return;
        }
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
        let reviewedBy = await User.findOne({ id: userId });
        await Notification.create({
          content: `<a href='#'>${exercise.title}</a> have been reviewed by <a href='/profile/${userId}'>${reviewedBy.displayName}</a> (${reviewedBy.email}).`,
          linkAction: ``,
          receiver: exercise.createdBy,
          type: 3,
        }).usingConnection(db);
        let stillWaitingReview = await DetailReview.find({
          requestId: requestId,
          isAccepted: "waiting",
        }).usingConnection(db);
        // check if exercise is self-reviewed or not
        if (requestReview.isAccepted === "waiting") {
          // if everyone reviewed
          if (stillWaitingReview.length === 0) {
            let rejectedReview = await DetailReview.find({
              requestId: requestId,
              isAccepted: "rejected",
            }).usingConnection(db);
            if (rejectedReview.length === 0) {
              await RequestReview.updateOne({
                id: requestReview.id,
              })
                .set({
                  isAccepted: "accepted",
                  isSelfReview: false,
                })
                .usingConnection(db);
              await Exercise.updateOne({
                id: requestReview.exerciseId,
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
                  isSelfReview: false,
                })
                .usingConnection(db);
              await Exercise.updateOne({
                id: requestReview.exerciseId,
              })
                .set({
                  isApproved: "rejected",
                })
                .usingConnection(db);
            }
          }
        }
        res.json({ success: true });
      });
    } catch (e) {
      res.json({
        success: false,
        code: 500,
      });
      console.log(e);
    }
  },

  selfReview: async (req, res) => {
    try {
      await sails.getDatastore().transaction(async (db) => {
        let { comment, isAccepted, exerciseId, userId } = req.body;
        if (
          !exerciseId ||
          exerciseId === "" ||
          (exerciseId !== undefined && Number.isNaN(Number(exerciseId)))
        ) {
          res.json({
            success: false,
            code: 0,
            data: { message: "not found" },
          });
          return;
        }
        let exercise = await Exercise.findOne({
          id: exerciseId,
        });
        if (!exercise) {
          res.json({
            success: false,
            code: 0,
            data: { message: "not found" },
          });
          return;
        }
        if (exercise.isDeleted) {
          res.json({
            success: false,
            code: 3,
            data: { message: "exercise was deleted" },
          });
          return;
        }
        if (exercise.createdBy !== Number(userId)) {
          res.json({
            success: false,
            code: 2,
            data: { message: "not authorized" },
          });
          return;
        }
        let requestReview = await RequestReview.find({
          where: {
            exerciseId: exerciseId,
          },
          sort: "createdAt DESC",
        })
          .limit(1)
          .usingConnection(db);
        requestReview = requestReview[0];
        if (requestReview && requestReview.isAccepted === "waiting") {
          await RequestReview.updateOne({
            id: requestReview.id,
          })
            .set({
              isAccepted: isAccepted ? "accepted" : "rejected",
              selfComment: comment,
              isSelfReview: true,
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
          res.json({
            success: false,
            code: 1,
            data: {
              isAccepted: requestReview.isAccepted,
              message: "already reviewed.",
            },
          });
          return;
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
