const config = {
  development: {
    domain: "localhost",
    frontendUrl: "http://localhost:5173", // blog前端
    cmsUrl: "http://localhost:5174", // cms前端
  },
  production: {
    domain: ".yourdomain.com",
    frontendUrl: "https://blog.yourdomain.com",
    cmsUrl: "https://cms.yourdomain.com",
  },
};

module.exports = config[process.env.NODE_ENV || "development"];
