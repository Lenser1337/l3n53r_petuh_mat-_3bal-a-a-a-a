var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	userID: String,
	displayName: String,
	highestRole: String,
	roles: Array,
	status: String,
	joinedAt: Date,
	messages: Number,
	infractions: Number,
	retrocoinCash: Number,
	retrocoinBank: Number,
	retrocoinTotal: Number,
	lastDice: Date,
	lastScan: Date,
	lastWork: Date,
	lastSlut: Date,
	lastSlutResult: Boolean,
	lastCrime: Date,
	lastCrimeResult: Boolean,
	lastRoulette: Date,
	lastRob: Date,
	lastCF: Date,
	chickenPower: Number,
	kissed: Number,
	lastKiss: Date,
	huged: Number,
	lastHug: Date,
	fcked: Number,
	lastFck: Date,
	hit: Number,
	inv: Array,
	lastHit: Date,
	killed: Number,
	lastKill: Date,
	drunk: Number,
	lastDrunk: Date,
	perkVipivoha: Boolean,
	perkSpid: Boolean,
	perkBattery: Boolean,
	perkAktivist: Boolean,
	perkAntikop: Boolean,
	perkBundar: Boolean,
	perkOligarx: Boolean,
	perkBankir: Boolean,
	perkMoneyLover: Boolean,
	lastChangeStatus: Date,
});

module.exports = mongoose.model('users', userSchema);
