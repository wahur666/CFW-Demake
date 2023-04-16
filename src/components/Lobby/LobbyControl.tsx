import { FrameHexagon, Text } from "@arwes/core";
import "./LobbyControl.module.scss";
import { useState } from "preact/compat";

const speeds = ["Slower", "Slow", "Normal", "Fast", "Faster"];

export default function LobbyControl() {
    const [controlPoints, setControlPoints] = useState(100);
    const onChange = (e) => setControlPoints(e.target.value);

    const [gameSpeed, setGameSpeed] = useState(0);
    const onChange2 = (e) => setGameSpeed(e.target.value);

    return (
        <FrameHexagon className="control-points h-100 flex-important items-center">
            <div className={"flex flex-col justify-evenly"}>
                <div className="flex flex-col items-center justify-center m-1">
                    <Text as={"h6"}>Control Points</Text>
                    <input type="range" id="test5" min="100" max="300" step="50" value={controlPoints} onChange={onChange} />
                    <p>{controlPoints}</p>
                </div>
                <div className="flex flex-col items-center justify-center m-1">
                    <Text as={"h6"}>Game Speed</Text>
                    <input type="range" id="test5" min="0" max="4" step="1" value={gameSpeed} onChange={onChange2} />
                    <p>{speeds[gameSpeed]}</p>
                </div>
            </div>
        </FrameHexagon>
    );
}
