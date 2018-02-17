export const SERVER_PORT: number = 8100;
export const EXTERNAL_IP: string = "127.0.0.1";
export const KEY: string = "hello i can mine blocks!";

export const blockchainEvents = {
    ADD_BLOCK: "add_block",
    CHECK_LAST_DATA: "check_last_data",
    START_MINING: "start_mining",
    SYNC_BLOCKCHAIN: "sync_blockchain",
};

export const p2pServerEvents = {
    NEW_BLOCK_MADE: "new_block_made",
};

export const p2pClientEvent = {
    SHOULD_GET_ALL_BLOCKS: "should_get_all_blocks",
};

export const wsClientMsgTypes = {
    GET_ALL_BLOCKS: "get_all_blocks",
    GET_LAST_DATA: "get_last_data",
};

export const wsServerMsgTypes = {
    ALL_BLOCKS: "all_blocks",
    LAST_DATA: "last_data",
    NEW_BLOCK: "new_block",
};
