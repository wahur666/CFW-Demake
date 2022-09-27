use tokio::io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;
use tokio::runtime::Runtime;

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

pub fn startServer() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Create the runtime
    let rt  = Runtime::new()?;

    // Spawn the root task
    rt.block_on(async {
        let listener = TcpListener::bind("0.0.0.0:8080").await?;
        println!("TCP server listening on 127.0.0.1:8080");
        loop {
            println!("wating for connection");
            let (mut socket, addr) = listener.accept().await?;
            println!("connected {}", addr);
            tokio::spawn(async move {
                println!("TOKIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                let (reader, mut writer) = socket.split();
                let mut reader = BufReader::new(reader);
                let mut line = String::new();

                // In a loop, read data from the socket and write the data back.
                loop {
                    let bytes_read = reader.read_line(&mut line).await.unwrap();
                    if bytes_read == 0 {
                        break;
                    }

                    writer.write_all(line.as_bytes()).await.unwrap();
                    line.clear();
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
