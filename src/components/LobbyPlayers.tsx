import {FrameHexagon} from "@arwes/core";
import PlayerControl from "./PlayerControl";

export default function LobbyPlayers() {
    return <FrameHexagon className={"player-selection"}>
        {Array(8).fill(1).map(_ => <PlayerControl/>)}
    </FrameHexagon>;
}
