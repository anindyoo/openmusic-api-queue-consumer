const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `
        SELECT playlists.id, playlists.name
        FROM playlists
        LEFT JOIN users 
          ON users.id = playlists.owner
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await this.pool.query(playlistQuery);

    const songsQuery = {
      text: `
        SELECT songs.id, songs.title, songs.performer 
        FROM songs
        INNER JOIN playlist_songs 
          ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1       
      `,
      values: [playlistId],
    };

    const songsResult = await this.pool.query(songsQuery);

    playlistResult.rows[0].songs = songsResult.rows;

    return playlistResult.rows[0];
  }
}

module.exports = PlaylistsService;
