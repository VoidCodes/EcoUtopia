module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question1: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
          max: 10,
        },
      },
      question2: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
          max: 10,
        },
      },
      longAnswer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      problemsEncountered: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
    },
    {
      tableName: "reports",
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.Resident, { foreignKey: "resident_id" });
  };

  return Report;
};
