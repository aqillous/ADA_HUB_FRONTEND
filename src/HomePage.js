import GoalComp from "./components/Goal_Comp";
import TimeLine from "./components/Timeline";
import News from "./components/News";
import CurrentVPsSlider from "./components/CurrentVPsSlider";
import PageContainer from "./layouts/PageContainer";

export default function HomePage() {
  return (
    <PageContainer>
      <GoalComp />

      <div className="flex flex-col lg:flex-row">
        <TimeLine />
        <News />
      </div>

      <CurrentVPsSlider />
    </PageContainer>
  );
}
