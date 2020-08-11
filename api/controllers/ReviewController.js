module.exports = {
  requestReview: async (req, res) => {
    try {
      let { exerciseId, reviewerIds } = req.body;
      console.log({ reviewerIds });
      let request = await RequestReview.create({
        exerciseId: exerciseId,
      }).fetch();
      let detailReviewPromises = reviewerIds.map(
        async (t) =>
          await DetailReview.create({
            requestId: request.id,
            reviewer: t,
          })
      );
      await Promise.all(detailReviewPromises);
      res.json({
        success: true,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  getRequestReview: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let request = await RequestReview.findOne({
        exerciseId: exerciseId,
      });
      res.json({
        success: true,
        data: request,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  review: async (req, res) => {
    try {
      let { comment, isAccepted, exerciseId, userId } = req.body;
      console.log({ comment, isAccepted, exerciseId, userId });
      // let request = await RequestReview.findOne({
      //   exerciseId: exerciseId,
      // });
      // let detailReview = await DetailReview.updateOne({
      //   requestId: request.id,
      //   reviewer: userId,
      // }).set({
      //   comment: comment,
      //   isAccepted: isAccepted,
      // });
      await Exercise.updateOne({
        id: exerciseId,
      }).set({
        isApproved: isAccepted,
      });
      res.json({
        success: true,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
};
