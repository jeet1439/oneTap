import cloudinary from "../config/coudinary.js";

export const getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      folder: "onetap",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUD_API_SECRET
    );

    return res.status(200).json({
      success: true,
      signature,
      timestamp,
      cloudName: process.env.CLOUD_NAME,
      apiKey: process.env.CLOUD_API_KEY, 
      folder: "onetap",
    });
  } catch (error) {
    console.error("Error in getUploadSignature:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCloudinaryImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "publicId is required",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCloudinaryImage:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};