import { useState } from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function Items({ currentItems }) {
  return (
    <>
      {/* {currentItems &&
          currentItems.map((item) => (
            <div>
              <h3>Item #{item}</h3>
            </div>
          ))} */}
    </>
  );
}

const PaginationComp = ({ pageSize, total, callback, offset = 0 }) => {
  let numPage = Math.ceil(total / pageSize);
  // let items = [];
  // for(let i = 0; i < numPage; i++){
  //     items.push(i + 1);
  // }
  const [itemOffset, setItemOffset] = useState(0);
  // const endOffset = itemOffset + pageSize;
  // const currentItems = items.slice(itemOffset, endOffset);
  const handlePageClick = async event => {
    const newOffset = (event.selected * pageSize) % total;
    setItemOffset(newOffset);
    //callback to parent's function
    // console.log(newOffset);
    await callback(pageSize, newOffset, event.selected);
  };
  return (
    <>
      {/* <Items currentItems={currentItems} /> */}
      <ReactPaginate
        breakLabel="..."
        nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={numPage}
        previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="item"
        previousClassName="item previous"
        nextClassName="item next"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        initialPage={offset}
      />
    </>
  );
};

export default PaginationComp;
