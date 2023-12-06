class Listener {
  constructor(playlistsService, mailSender) {
    this.playlistsService = playlistsService;
    this.mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlists = await this.playlistsService.getPlaylistSongs(playlistId);
      const result = await this.mailSender.sendEmail(targetEmail, JSON.stringify(playlists));

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
