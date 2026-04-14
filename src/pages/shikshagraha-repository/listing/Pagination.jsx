import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useMediaQuery } from "react-responsive";

function Pagination({
  resourcesPerPage,
  totalResources,
  paginate,
  selectedPage,
}) {
  const pageCount = Math.ceil(totalResources / resourcesPerPage);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    paginate(selectedPage);
  };
  const defined_dimension_class = isMobile ? "w-[34px] h-[34px]" : "w-[54px] h-[54px]"
  const label_class = "flex flex-col items-center justify-center border p-1 rounded bg-white text-sm  " + defined_dimension_class  
  const activePageClass =
    defined_dimension_class +
    " bg-[var(--listing-secondary)] text-white p-1 border-0 rounded flex items-center justify-center"
  return (
    <div className="flex justify-center">
      <ReactPaginate
        forcePage={selectedPage}
        previousLabel={
          <div className={label_class}>
            <ChevronLeft className="icon" />
          </div>
        }
        nextLabel={
          <div className={label_class}>
            <ChevronRight className="icon" />
          </div>
        }
        breakLabel={
          <div className={label_class}>
            <span className="text-xl">...</span>
          </div>
        }
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={isMobile ? 1 : 5}
        onPageChange={handlePageClick}
        containerClassName="flex items-center gap-2"
        previousLinkClassName="text-[var(--listing-muted-text)]"
        nextLinkClassName="text-[var(--listing-muted-text)]"
        activeLinkClassName={activePageClass}
        activeClassName={activePageClass}
        pageLinkClassName={defined_dimension_class + " flex items-center justify-center border rounded"}
      />
    </div>
  );
}

export default Pagination;
