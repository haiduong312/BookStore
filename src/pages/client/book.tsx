import { useParams } from "react-router-dom";
import BookDetails from "components/client/book.details";

const BookPage = () => {
    const { id } = useParams();
    return <BookDetails bookId={id} />;
};
export default BookPage;
