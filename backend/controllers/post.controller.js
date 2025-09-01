import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(401).json({ message: "No image found" });
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'cover' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudRespone = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudRespone.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: "New post added",
            success: true,
            post
        })

    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilePicture' } });

        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({ path: "comments", sort: { createdAt: -1 }, populate: { path: "author", select: "username profilePicture" } });

        return res.status(200).json({
            posts,
            succes: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const toggleLikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(401).json({
                message: "Post not found",
                success: false
            })
        }

        if (!post.likes.includes(userId)) {
            await post.updateOne({ $addToSet: { likes: userId } })
            await post.save()

            const user = await User.findById(userId).select('username profilePicture').lean();
            const postOwnerId = post.author.toString();

            if (postOwnerId !== userId) {
                const notification = {
                    type: "like",
                    userId,
                    userDetails: user,
                    postId,
                    message: "Your post was liked",
                }
                const postOwnerSocketId = getRecieverSocketId(postOwnerId);
                io.to(postOwnerSocketId).emit("notification", notification);
            }


            return res.status(200).json({
                success: true,
                message: "Post liked"
            })
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            await post.save()

            const user = await User.findById(userId).select('username profilePicture').lean();
            const postOwnerId = post.author.toString();

            if (postOwnerId !== userId) {
                const notification = {
                    type: "dislike",
                    userId,
                    userDetails: user,
                    postId,
                    message: "Your post was disliked",
                }

                const postOwnerSocketId = getRecieverSocketId(postOwnerId);
                io.to(postOwnerSocketId).emit('notification', notification);
            }


            return res.status(200).json({
                success: true,
                message: "Post disliked"
            })
        }

    } catch (error) {
        console.log(error);
    }
}

// export const disLikePost = async (req, res) => {
//     try {
//         const userId = req.id;
//         const postId = req.params.id;
//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(401).json({
//                 message: "Post not found",
//                 success: false
//             })
//         }

//         await post.updateOne({ $pull: { likes: userId } });
//         await post.save();

//         // socket impementation

//         return res.status(200).json({
//             success: true,
//             message: "Post disliked"
//         })

//     } catch (error) {
//         console.log(error);
//     }
// }

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { content } = req.body;

        if (!content) {
            return res.status(401).json({
                message: "content is required",
                success: false
            })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(401).json({ message: "Post not found", succes: false })
        }

        const comment = await Comment.create({
            text: content,
            post: postId,
            author: userId
        })

        await comment.populate({
            path: "author",
            select: "username profilePicture"
        })

        post.comments.push(comment._id);
        await Promise.all([post.save(), comment.save()]);

        return res.status(200).json({
            message: "Commented successfully",
            comment,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate({ path: "author", select: "username profilePicture" });

        if (!comments) {
            return res.status(200).json({
                message: "No comments to display",
                success: true
            })
        }

        return res.status(200).json({
            comments,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false
            })
        }

        if (post.author.toString() !== authorId) {
            return res.status(400).json({
                message: "User not authenticated",
                success: false
            })
        }

        await Post.findByIdAndDelete(postId);

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success: false
            })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        if (!user.bookmarks.includes(post._id)) {
            await user.updateOne({ $addToSet: { bookmarks: postId } })
            await user.save()
            return res.status(200).json({
                message: "Post bookmarked successfully",
                success: true
            })
        } else {
            await user.updateOne({ $pull: { bookmarks: postId } })
            await user.save()
            return res.status(200).json({
                message: "Post removed from bookmarks",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}