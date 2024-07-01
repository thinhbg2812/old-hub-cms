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

const PaginationComp = ({ pageSize, total, callback }) => {
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
    await callback(pageSize, newOffset);
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
        activeClassName="item active-page"
        breakClassName="item break-me"
        containerClassName="pagination m-auto"
        disabledClassName="disabled-page"
        nextClassName="item next"
        pageClassName="item pagination-page"
        previousClassName="item previous"
      />
    </>
  );
};

export default PaginationComp;
