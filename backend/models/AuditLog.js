import mongoose from "mongoose"

const auditLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "login", "logout", "register", "deactivate"],
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["user", "task"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: Object,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const AuditLog = mongoose.model("AuditLog", auditLogSchema)

export default AuditLog
