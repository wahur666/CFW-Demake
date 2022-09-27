use tokio::io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;
use tokio::runtime::Runtime;
use tokio::sync::broadcast;

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

pub fn start_server() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Create the runtime
    let rt  = Runtime::new()?;

    // Spawn the root task
    rt.block_on(async {
        let listener = TcpListener::bind("0.0.0.0:8080").await?;
        let (tx, _rx) = broadcast::channel(10);
        println!("TCP server listening on 127.0.0.1:8080");
        loop {
            println!("wating for connection");
            let (mut socket, addr) = listener.accept().await?;
            let tx = tx.clone();
            let mut rx = tx.subscribe();

            println!("connected {}", addr);
            tokio::spawn(async move {
                println!("TOKIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                let (reader, mut writer) = socket.split();
                let mut reader = BufReader::new(reader);
                let mut line = String::new();

                // In a loop, read data from the socket and write the data back.
                loop {
                    tokio::select! {
                        result = reader.read_line(&mut line) => {
                            if result.unwrap() == 0 {
                                break;
                            }
                            tx.send((line.clone(), addr)).unwrap();
                            line.clear();
                        },
                        result = rx.recv() => {
                            let (msg, other_addr) = result.unwrap();
                            if addr != other_addr {
                                writer.write_all(msg.as_bytes()).await.unwrap();
                            }
                        }
                    }
                }
            });
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
