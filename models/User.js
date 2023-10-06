import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email : { type: String, required: true },
    password : { type: String, required: true }
  },
  { versionKey: false } // Supprime la propriété "__v" ajoutée automatiquement par Mongoose à chaque document
);

const collectionName = 'users'
export const      UserModel = mongoose.model('Users', UserSchema, collectionName)


