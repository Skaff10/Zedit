const mongoose = require("mongoose");

const versionSchema = mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    //Yjs SnapShot stored as Buffer
    snapshot : {
        type: Buffer,
        required: true,
    },
    summary : {
       type : String,
       
    },
}, {
    timestamps : true,
})

module.exports = mongoose.model("Version", versionSchema);
