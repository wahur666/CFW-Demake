extern crate cfw_network;

use std::thread::spawn;
use cfw_network::{add, start_server};

pub fn initialize_systems(host: bool) {
    println!("Initializing systems as {} ....", if host {"host"} else {"guest"});
    println!("qweqweqw {}", add(1, 2));
    spawn(move || {
        start_server()
    });
}