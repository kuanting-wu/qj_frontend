export default {
    gamePlan: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        name: "",
        description: "",
        language: "English",
        createdAt: "",
        updatedAt: "",
        publicStatus: "public",
        ownerName: "",
        avatarUrl: "",
        belt: "",
        academy: ""
      })
    }
  };