import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

class SignalRService {
  private connection: HubConnection | null = null;

  public async startConnection(): Promise<void> {
    const url = import.meta.env.VITE_API_URL;
    this.connection = new HubConnectionBuilder()
      .withUrl(`${url}/signalr-hub`)
      .build();

    try {
      await this.connection.start();
      console.log("SignalR connection started.");
    } catch (error) {
      console.error("Connection failed: ", error);
    }
  }

  public stopConnection(): void {
    if (this.connection) {
      this.connection.stop();
    }
  }

  public onDeleted(callback: (deletedId: string) => void): void {
    if (this.connection) {
      this.connection.on("Deleted", callback);
    }
  }
}

const signalrService = new SignalRService();
export default signalrService;
