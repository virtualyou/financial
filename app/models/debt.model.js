const DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("debts", {
        name: {
            type: Sequelize.STRING
        },
        debtType: {
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
        frequency: {
            type: Sequelize.STRING
        },
        due: {
            type: DataTypes.DATE
        },
        payment: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};

/*
  Debt.create({
    name: "Water Utility",
    debtType: "Utility",
    accountNo: "123456",
    website: "https://vawater.gov",
    websiteUser: "guitarman77",
    websitePassword: "pass123",
    holdingCompany: "Virginia Water Utility",
    holdingCompanyAddress: "23 North Pike, Petersburg, VA 12345",
    holdingCompanyPhone: "800-123-4567",
    balance: "0.00",
    frequency: "Monthly",
    due: "11/15/2023",
    payment: "65.75",
    userKey: 10
*/