import {FrameHexagon} from "@arwes/core";

export default function LobbyChat() {
    return <div className={"flex flex-col items-center chat w-100"}>
        <FrameHexagon className={"m-1 p-1 w-100"}>
            <div style={{
                height: 24,
            }}>
                Aa
            </div>
        </FrameHexagon>
        <FrameHexagon className={"m-1 p-1 w-100 flex-1"}>
            <div className={""}>
                Bb
            </div>
        </FrameHexagon>
    </div>;
}
