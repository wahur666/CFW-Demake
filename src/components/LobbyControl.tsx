import {FrameHexagon, Text} from "@arwes/core";
import "./LobbyControl.module.scss";

export default function LobbyControl() {
    return <FrameHexagon className="control-points h-100 flex-important items-center">
        <div className={"flex flex-col justify-evenly"}>
            <div className="flex flex-col items-center justify-center m-1">
                <Text as={"h6"}>
                    Control Points
                </Text>
                <input type="range" id="test5" min="100" max="300" step="50"/>
                <p>{100}</p>
            </div>
            <div className="flex flex-col items-center justify-center m-1">
                <Text as={"h6"}>
                    Game Speed
                </Text>
                <input type="range" id="test5" min="100" max="300" step="50"/>
                <p>{100}</p>
            </div>
        </div>
    </FrameHexagon>;
}
