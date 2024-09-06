import { useParams } from "react-router-dom"
import { useGetPostByIdQuery } from "../../app/services/postsApi"
import { Card } from "../../components/card"
import { GoBack } from "../../components/go-back"
import { CreateComments } from "../../components/create-comment"

const CurrentPost = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetPostByIdQuery(params?.id ?? "")

  if (!data) {
    return <h2>Пост не найден</h2>
  }

  const {
    content,
    id,
    author,
    likes,
    authorId,
    likedByUser,
    createdAt,
    comments,
  } = data
  return (
    <>
      <GoBack />
      <Card
        avatarUrl={author.avatarUrl ?? ""}
        content={content}
        name={author.name ?? ""}
        likesCount={likes.length}
        likedByUser={likedByUser}
        commentCount={comments.length}
        authorId={authorId}
        id={id}
        createdAt={createdAt}
        cardFor="current-post"
      />
      <div className="mt-10">
        <CreateComments />
      </div>
      <div className="mt-10">
        {data.comments
          ? data.comments.map(comment => (
              <Card
                cardFor="comment"
                key={comment.id}
                avatarUrl={comment.user.avatarUrl ?? ""}
                content={comment.content}
                name={comment.user.name ?? ""}
                authorId={comment.userId}
                commentId={comment.id}
                id={id}
              />
            ))
          : null}
      </div>
    </>
  )
}

export default CurrentPost
//если мне div нужен без classname то пишу просто <></>
