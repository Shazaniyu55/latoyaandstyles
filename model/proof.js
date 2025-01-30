const mongoose = require('mongoose');

const ProofSchema = new mongoose.Schema({

  image: {
    type: String
  }

 
},

{timestamps: true}
);

const Proof = mongoose.model('Proof', ProofSchema);
module.exports = Proof
