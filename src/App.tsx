import React, { useEffect } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchPosts, clearPosts } from './redux/slices/postsSlice';
import { fetchUsers } from './redux/slices/usersSlice';
import { Post } from './types/Post';
import { clearComments } from './redux/slices/commentsSlice';
import {
  selectAuthor, selectPosts, selectSelectedPost,
} from './redux/selectors';
import {
  clearSelectedPost, setSelectedPost,
} from './redux/slices/selectedPostSlice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const author = useAppSelector(selectAuthor);
  const { items, loaded, hasError } = useAppSelector(selectPosts);
  const selectedPost = useAppSelector(selectSelectedPost);

  const onSelectedPost = (post: Post | null) => {
    if (!post) {
      dispatch(clearSelectedPost());

      return;
    }

    dispatch(setSelectedPost(post));
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(clearSelectedPost());

    if (author) {
      dispatch(fetchPosts(author.id));
    } else {
      dispatch(clearPosts());
    }
  }, [author?.id]);

  useEffect(() => {
    dispatch(clearComments());
  }, [selectedPost?.id]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector selectedUser={author} />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {author && !loaded && (
                  <Loader />
                )}

                {author && loaded && hasError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {author && loaded && !hasError && items.length === 0 && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {author && loaded && !hasError && items.length > 0 && (
                  <PostsList
                    posts={items}
                    selectedPostId={selectedPost?.id}
                    onPostSelected={onSelectedPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails post={selectedPost} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};