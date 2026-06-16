class TrustScoreService {
  calculateNewScore(currentScore, isApproved, isAnomaly = false) {
    let change = isApproved ? (isAnomaly ? 15 : 5) : -10;
    let newScore = Math.max(0, Math.min(100, currentScore + change));
    return { newScore, change };
  }

 

  calculateRewardPoints(isApproved, isAnomaly, trustScore) {
    if (!isApproved) return 0;
    let points = 10;
    if (isAnomaly) points += 15;
    if (trustScore >= 80) points += 5;
    return points;
  }
}

module.exports = new TrustScoreService();