import GeneralInfo from "./GeneralInfo";
import Skills from "./Skills";
import Resume from "./Resume";
import GitHub from "./GitHub";

export default function Overview({ user }) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <GeneralInfo user={user} />
      <Skills user={user} />
      <Resume user={user} />
      <GitHub user={user} />
    </div>
  );
}
