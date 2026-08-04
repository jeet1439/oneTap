import prisma from "../lib/prisma.js";



export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        ble_id: true,
        createdAt: true,
        updatedAt: true,

        featuredPhotos: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Error in getMe:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        ble_id: true,
        createdAt: true,

        featuredPhotos: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Error in getUserById:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      username,
      bio,
      image,
    } = req.body;

    // Check username availability
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(username !== undefined && {
          username,
        }),

        ...(bio !== undefined && {
          bio,
        }),

        ...(image !== undefined && {
          image,
        }),
      },

      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        ble_id: true,
        createdAt: true,
        updatedAt: true,

        featuredPhotos: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error in updateProfile:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateBleId = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      ble_id,
    } = req.body;

    if (!ble_id) {
      return res.status(400).json({
        success: false,
        message: "BLE ID is required",
      });
    }

    // Check if BLE ID belongs to another user
    const existingUser = await prisma.user.findFirst({
      where: {
        ble_id,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This BLE ID is already registered",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ble_id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        ble_id: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "BLE ID updated successfully",
      user,
    });

  } catch (error) {
    console.error("Error in updateBleId:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const addFeaturedPhoto = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      imageUrl,
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Find current number of photos
    const photoCount = await prisma.featuredPhoto.count({
      where: {
        userId,
      },
    });

    const photo = await prisma.featuredPhoto.create({
      data: {
        userId,
        imageUrl,
        position: photoCount,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Featured photo added successfully",
      photo,
    });

  } catch (error) {
    console.error("Error in addFeaturedPhoto:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const deleteFeaturedPhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    const photoId = Number(req.params.photoId);

    if (isNaN(photoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid photo ID",
      });
    }

    // Make sure photo belongs to logged-in user
    const photo = await prisma.featuredPhoto.findFirst({
      where: {
        id: photoId,
        userId,
      },
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    await prisma.featuredPhoto.delete({
      where: {
        id: photoId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Featured photo deleted successfully",
    });

  } catch (error) {
    console.error("Error in deleteFeaturedPhoto:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const searchUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const search = req.query.q || "";

    if (!search.trim()) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },

        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },

      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        ble_id: true,

        featuredPhotos: {
          orderBy: {
            position: "asc",
          },
        },
      },

      take: 20,
    });

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error("Error in searchUsers:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getRecommendedUsers = async (req, res) => {
  try {
    const userId = req.user.userId;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },

      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        ble_id: true,

        featuredPhotos: {
          orderBy: {
            position: "asc",
          },
        },
      },

      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error("Error in getRecommendedUsers:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Error in deleteAccount:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

