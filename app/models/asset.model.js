module.exports = (sequelize, Sequelize) => {
    return sequelize.define("assets", {
        name: {
            type: Sequelize.STRING
        },
        assetType: {
            type: Sequelize.STRING
        },
        accountNo: {
            type: Sequelize.STRING
        },
        website: {
            type: Sequelize.STRING
        },
        websiteUser: {
            type: Sequelize.STRING
        },
        websitePassword: {
            type: Sequelize.STRING
        },
        holdingCompany: {
            type: Sequelize.STRING
        },
        holdingCompanyAddress: {
            type: Sequelize.STRING
        },
        holdingCompanyPhone: {
            type: Sequelize.STRING
        },
        balance: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};

/*
  Asset.create({
    name: "Checking LFCU",
    assetType: "Regular Checking",
    accountNo: "AT-00-9999235",
    website: "https://lfcu.com",
    websiteUser: "popeye2",
    websitePassword: "ssap123",
    holdingCompany: "Langley Federal Credit Union",
    holdingCompanyAddress: "45 Stagecoach Ln, Carson City, NV, 25289",
    holdingCompanyPhone: "800-429-2035",
    balance: "3879.13",
    userKey: 10
  });
*/