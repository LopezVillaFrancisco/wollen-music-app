import { Router } from 'express';
import { lastfmController } from '../controllers/lastfm.controller.js';

const router = Router();

router.get('/artists/search', lastfmController.searchArtist);
router.get('/artists/:name', lastfmController.getArtistInfo);
router.get('/artists/:name/tracks', lastfmController.getArtistTopTracks);
router.get('/artists/:name/albums', lastfmController.getArtistTopAlbums);

router.get('/albums', lastfmController.getAlbumInfo);
router.get('/albums/search', lastfmController.searchAlbum);

router.get('/tracks', lastfmController.getTrackInfo);
router.get('/tracks/chart', lastfmController.getChartTopTracks);
router.get('/tracks/search', lastfmController.searchTrack);

router.get('/tags', lastfmController.getTopTags);
router.get('/tags/:tag/artists', lastfmController.getTagTopArtists);
router.get('/tags/:tag/trends', lastfmController.getTagTrends);

export default router;
