import _CQGAME = CQGAMETYPES._CQGAME;
import OPTIONS = CQGAMETYPES.OPTIONS;
import {applyMixins} from "../TsBlackMagic/mixins";
import RANDOM_TEMPLATE = CQGAMETYPES.RANDOM_TEMPLATE;
import GAMETYPE = CQGAMETYPES.GAMETYPE;
import MONEY = CQGAMETYPES.MONEY;
import MAPTYPE = CQGAMETYPES.MAPTYPE;
import MAPSIZE = CQGAMETYPES.MAPSIZE;
import TERRAIN = CQGAMETYPES.TERRAIN;
import STARTING_UNITS = CQGAMETYPES.STARTING_UNITS;
import VISIBILITYMODE = CQGAMETYPES.VISIBILITYMODE;
import COMMANDLIMIT = CQGAMETYPES.COMMANDLIMIT;

const MAX_PLAYERS = 8;


export namespace CQGAMETYPES {
    export enum DIFFICULTY {
        NODIFFICULTY,
        EASY,
        AVERAGE,
        HARD
    }

    export enum TYPE {
        HUMAN,
        COMPUTER
    }

    export enum COMP_CHALANGE {
        EASY_CH,
        AVERAGE_CH,
        HARD_CH,
        IMPOSIBLE_CH,
        NIGHTMARE_CH,
    }

    export enum STATE {
        OPEN,		// slot can be used, but not active at this time
        CLOSED,		// host has disallowed this slot
        ACTIVE,		// slot is being used by computer or human player, has not accepted game rules yet
        READY		// slot is active and player has accepted rules
    }

    export enum RACE {
        NORACE,
        TERRAN,
        MANTIS,
        SOLARIAN,
        VYRIUM,
    }

    export enum COLOR {
        UNDEFINEDCOLOR,	// used for computer players
        YELLOW,
        RED,
        BLUE,
        PINK,
        GREEN,
        ORANGE,
        PURPLE,
        AQUA
    }

    export enum TEAM {
        NOTEAM,
        _1,
        _2,
        _3,
        _4
    }

    export class SLOT {
        type: TYPE = TYPE.COMPUTER;
        compChalange: COMP_CHALANGE = 4;
        state: STATE = 3;
        race: RACE = 4;
        color: COLOR = 5;
        team: TEAM = 4;
        zoneSeat: number = 3;
        dpid: number;			// id of player, 0 if computer player
        constructor(dpid: number) {
            this.dpid = dpid;
        }
    }

    export enum GAMETYPE			// need 2 bits
    {
        KILL_UNITS = -2,
        KILL_HQ_PLATS,
        MISSION_DEFINED,	// must be == 0
        KILL_PLATS_FABS
    }

    export enum MONEY				// need 2 bits
    {
        LOW_MONEY = -2,
        MEDIUM_MONEY,
        HIGH_MONEY
    }

    export enum MAPTYPE			// need 2 bits
    {
        SELECTED_MAP = -2,
        USER_MAP,			// from saved game dir
        RANDOM_MAP
    }

    export enum MAPSIZE			// need 2 bits
    {
        SMALL_MAP = -2,
        MEDIUM_MAP,
        LARGE_MAP
    }

    export enum TERRAIN			// need 2 bits
    {
        LIGHT_TERRAIN = -2,
        MEDIUM_TERRAIN,
        HEAVY_TERRAIN
    }

    export enum STARTING_UNITS		// need 2 bits
    {
        UNITS_MINIMAL = -2,
        UNITS_MEDIUM,
        UNITS_LARGE
    }

    export enum VISIBILITYMODE		// need 2 bits
    {
        VISIBILITY_NORMAL = -1,
        VISIBILITY_EXPLORED,
        VISIBILITY_ALL
    }

    export enum RANDOM_TEMPLATE	//need 2 bits
    {
        TEMPLATE_NEW_RANDOM = -2,
        TEMPLATE_RANDOM,
        TEMPLATE_RING,
        TEMPLATE_STAR,
    }

    export enum COMMANDLIMIT		// need 2 bits
    {
        COMMAND_LOW = -2,
        COMMAND_NORMAL,
        COMMAND_MID,
        COMMAND_HIGH
    }

    export class OPTIONS {
        /** Game Version */
        version: number;
        /** Game Type:
         * - Kill all units
         * - HQ Plats
         * - Kill Plast + Fabs
         * */
        gameType: GAMETYPE = GAMETYPE.KILL_HQ_PLATS;
        gameSpeed: number = 5;	// need enough bits for -16 to 15

        regenOn: number = 1;
        spectatorsOn: number = 1;
        lockDiplomacyOn: number = 1;

        /** Number of system to use - Max 16!*/
        numSystems: number = 5;

        /** Starting resource
         * - Low
         * - Med
         * - High
         * */
        money: MONEY = MONEY.MEDIUM_MONEY;

        mapType: MAPTYPE = MAPTYPE.RANDOM_MAP;

        /** Generation Template
         * - Pure Random
         * - Random
         * - Star
         * - Ring*/
        templateType: RANDOM_TEMPLATE = RANDOM_TEMPLATE.TEMPLATE_NEW_RANDOM;

        /** Map Size
         * - Small
         * - Medium
         * - Large */
        mapSize: MAPSIZE = MAPSIZE.LARGE_MAP;

        /** Terrain Type
         * - Light
         * - Medium
         * - Heavy */
        terrain: TERRAIN = TERRAIN.LIGHT_TERRAIN;

        /** Starting units
         * - Minimal
         * - Standard
         * - Advanced
         *  */
        units: STARTING_UNITS = STARTING_UNITS.UNITS_MEDIUM;

        /** Visibility
         * - Normal
         * - Explored
         * - All visible
         * */
        visibility: VISIBILITYMODE = VISIBILITYMODE.VISIBILITY_NORMAL;
        commandLimit: COMMANDLIMIT = COMMANDLIMIT.COMMAND_NORMAL;
    }

    export class _CQGAME {
        activeSlots: number = 8;			// valid from 1 to MAX_PLAYERS
        bHostBusy: number = 1;			// host is not on the final screen
        startCountdown: number = 4;
        slot: SLOT[];
    }

}  // end namespace CQGAMETYPES


export interface CQGame extends CQGAMETYPES._CQGAME, CQGAMETYPES.OPTIONS {
}

export class CQGame {
    constructor() {
        this.activeSlots = 8;
        this.bHostBusy = 1;
        this.startCountdown = 4;
        this.slot = Array(MAX_PLAYERS)
            .fill(0)
            .map((_, i) => {
                const slot = new CQGAMETYPES.SLOT(i);
                slot.color = i + 1;
                return slot;
            });
        this.gameType = GAMETYPE.KILL_PLATS_FABS;
        this.gameSpeed = 5;
        this.regenOn = 1;
        this.spectatorsOn = 1;
        this.lockDiplomacyOn = 1;
        this.numSystems = 5;
        this.money = MONEY.MEDIUM_MONEY;
        this.mapType = MAPTYPE.RANDOM_MAP;
        this.templateType = RANDOM_TEMPLATE.TEMPLATE_RANDOM;
        this.mapSize = MAPSIZE.MEDIUM_MAP;
        this.terrain = TERRAIN.LIGHT_TERRAIN;
        this.units = STARTING_UNITS.UNITS_MEDIUM;
        this.visibility = VISIBILITYMODE.VISIBILITY_NORMAL;
        this.commandLimit = COMMANDLIMIT.COMMAND_NORMAL;
    }
}

applyMixins(CQGame, [CQGAMETYPES._CQGAME, CQGAMETYPES.OPTIONS])

