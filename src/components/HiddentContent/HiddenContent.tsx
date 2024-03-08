import { useState } from "react";
import unroll from "../../images/icons/VectorDown.png";
import rollUp from "..//../images/icons/VectorUp.png";

export default function HiddenContent({collapseTitle, collapseDescription}) {

const [showContent, setShowContent] = useState(false)

return (
  <div className="informationBlock">
      <div>
        <div className="unroll" onClick={() => setShowContent(!showContent)}>
        {collapseTitle}
        <img
            src={showContent ? rollUp : unroll}
            alt="dérouler ou enrouler la section"
          />
        </div>
        {showContent && (
          <div className={`${showContent ? 'visible' : 'invisible'}`}>
            {collapseDescription}
          </div>
        )}
      </div>
  </div>
);
}
