import ScoreSection from "./ScoreSection"
import GapSection from "./GapSection"
import RecommendationSection from "./RecommendationSection"
import RoadmapSection from "./RoadmapSection"
import RecruiterSection from "./RecruiterSection"

export default function ResultSection({ result }) {
  return (
    <div className="mt-8 space-y-6">
      <ScoreSection scores={result.scores} />
      <GapSection gaps={result.gaps} />
      <RecommendationSection recommendations={result.recommendations} />
      <RoadmapSection roadmap={result.roadmap} />
      <RecruiterSection recruiter={result.recruiter_lens} />
    </div>
  )
}
