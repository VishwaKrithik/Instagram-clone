import express from "express";
import isAuthenticated from "../midlewares/isAuthenticated.js";
import upload from "../midlewares/mutler.js";
import { addComment, addNewPost, bookmarkPost, deletePost, getAllPost, getCommentOfPost, getUserPost, toggleLikePost } from "../controllers/post.controller.js";

const router = express.Router();

router.route('/addPost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPost);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/toggleLike').get(isAuthenticated, toggleLikePost);
// router.route('/:id/dislike').get(isAuthenticated, disLikePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comment/all').get(isAuthenticated, getCommentOfPost);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);

export default router;