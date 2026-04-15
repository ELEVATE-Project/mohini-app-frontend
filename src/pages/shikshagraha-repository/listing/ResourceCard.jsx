import React from "react"
import { Star, Download, FileSpreadsheet, FileText, FileType, File, Eye } from "lucide-react"
import ROUTES from "../../../url"
import env from "../../../utils/env"
import { trackResourceView } from "api/endpoints/analytics"
import { listingTheme } from "../../../theme"

const MEDIA_FILE_TYPE = {
  PDF: "PDF",
  DOCX: "DOCX",
  XLSX: "XLSX",
}

// Get file type badge styles and icon
export const getMediaFileTypeStyles = (label_value, cardBackground) => {
  switch (label_value) {
    case MEDIA_FILE_TYPE.PDF:
      return {
        background: "bg-[var(--listing-danger)]",
        textColor: "text-white",
        Icon: FileType,
      }
    case MEDIA_FILE_TYPE.DOCX:
      return {
        background: "bg-[var(--listing-info)]",
        textColor: "text-white",
        Icon: FileText,
      }
    case MEDIA_FILE_TYPE.XLSX:
      return {
        background: "bg-emerald-500",
        textColor: "text-white",
        Icon: FileSpreadsheet,
      }
    default:
      return {
        background: cardBackground || "bg-[var(--listing-muted-text)]",
        textColor: "text-white",
        Icon: File,
      }
  }
}




export default function ResourceCard({ resource, index }) {
  const paletteEntry = listingTheme.cardPalette[index % listingTheme.cardPalette.length] || {
    background: listingTheme.colors.dangerSoft,
    text: listingTheme.colors.strongText,
  }
  const cardStyle = {
    backgroundColor: paletteEntry.background,
    color: paletteEntry.text,
  }
  const card_background = "bg-transparent"
  const { background: fileTypeBg, textColor, Icon: FileIcon } = getMediaFileTypeStyles(resource?.media_type_display, card_background)
  
  return (
    <div
      className="bg-white rounded-[20px] border border-[var(--listing-border)] overflow-hidden hover:shadow-lg transition-shadow
                 flex flex-col justify-between w-full min-w-[340px] h-full box-border "
      role="button"
      onClick={() => {
        // Fire analytics event without blocking navigation
        trackResourceView(resource?.id)

        const root = (env.ROOT_PATH() || "").replace(/^\/|\/$/g, "")
        const repo = (ROUTES.SHIKSHAGRAHA_REPOSITORY || "").replace(/^\/|\/$/g, "")
        const id = resource?.id ? `/${resource.id}` : ""

        const pathParts = [root, repo].filter(Boolean).join("/")
        const finalUrl = `${window.location.origin}${pathParts ? "/" + pathParts : ""}${id}`

        window.open(finalUrl, "_blank")
      }}
    >
      <div className="flex flex-col gap-3.5 p-3.5">
        {/* Image container */}
        <div className="relative flex flex-col gap-2.5 isolate w-full h-[154px] rounded-[10px]">
          {/* PDF Preview or Colored Background */}
          {resource?.thumbnail_url ? (
            <div className="border border-[var(--listing-border-strong)] rounded-[20px] overflow-none">
              <img className="object-cover rounded-[20px] w-full max-h-[154px]" src={resource.thumbnail_url} />
            </div>
          ) : (
            <div className="w-full h-full rounded-[10px]" style={cardStyle} aria-label="Image placeholder">
                        {/* Title over image */}
          <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-manrope font-bold text-[16px] leading-[22px] max-w-[300px] h-[22px] flex items-center justify-center z-30 text-center"
            style={cardStyle}
          >
            {resource?.title}
          </h3>

            </div>
          )}

          {/* Like (Heart) button: FUTURE @TODO */}
          {/* <button
          className="absolute right-[9px] top-[10px] w-[30px] h-[30px] bg-[var(--listing-surface)]
                     rounded-[17.6471px] shadow-[0_0_100px_#CFD7DC] flex justify-center items-center z-20"
          aria-label="Like"
          type="button"
        >
          <Heart className="w-[21px] h-[21px]" />
        </button> */}
        </div>
        {/* Details container */}
        <div className="flex flex-col gap-2 max-w-[320px] w-full">
          {/* Description */}
          <div className="flex flex-col justify-center gap-1.5 py-2 w-full overflow-hidden" aria-label="Resource description">
            <h4 className="font-semibold text-[1rem] text-md leading-[22px] text-black">{resource?.title || "Not Available"}</h4>
            <p className="font-normal  leading-[20px] text-[var(--listing-muted-text)] overflow-hidden line-clamp-2">{resource?.description || "Not Available"}</p>
          </div>

          <div className="flex items-center justify-between gap-2 border border-[var(--listing-border-strong)] py-2 !border-l-0 !border-r-0">
            <div className="flex items-center gap-2">
              <p className="text-[var(--listing-body-text)] text-xs">File type</p>
              <div className={`rounded-md uppercase px-2 py-1 text-xs flex items-center gap-1 ${fileTypeBg} ${textColor}`}>
                <FileIcon className="w-3 h-3" />
                {resource?.media_type_display}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--listing-chip-text)]">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{resource?.view_count ?? 0}</span>
              </div>
              <span className="text-[var(--listing-border-strong)]">|</span>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{resource?.download_count ?? 0}</span>
              </div>
            </div>
          </div>
          {/* Tags row */}
          <div className="flex flex-row flex-wrap gap-2.5 w-full  overflow-hidden" aria-label="Resource tags">
            {[resource?.tag_names?.[0], resource?.tag_names?.[1]]?.map((tag, i) =>
              tag ? (
                <span key={i} className="bg-[var(--listing-border)] rounded-full py-[2px] px-[10px] font-inter font-medium text-[12px] leading-[16px] text-[var(--listing-chip-text)]">
                  {tag}
                </span>
              ) : null
            )}
            {resource?.tag_names?.length > 2 && <span className="bg-[var(--listing-border)] rounded-full py-[2px] px-[10px] font-inter font-medium text-[12px] leading-[16px] text-[var(--listing-chip-text)]">+{resource?.tag_names?.length - 2} more</span>}
          </div>
        </div>
      </div>

      <div className="h-full flex items-start justify-end flex-col p-3.5 pt-0">
        {/* Rating and download count */}
        <div className="flex flex-row justify-between items-center w-full min-h-[36px] d-none">
          {/* Rating */}
          {!!resource?.rating ? (
            <div className="flex flex-row justify-between items-center gap-2 w-[216px] min-h-[36px]">
              <div className="flex flex-row gap-2 w-[128px] text-xs items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-[1.25rem] h-[1.25rem] ${i < 4 ? "text-amber-400 fill-current" : "text-[var(--listing-disabled)]"}`} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs font-urbanist font-medium leading-[20px] text-[var(--listing-muted-text)]">
                <span>{resource?.rating}</span>
                <span>({resource?.reviews})</span>
              </div>
            </div>
          ) : (
            <div className="min-h-[36px]" />
          )}

          {/* Downloads */}
          {!!resource?.downloads ? (
            <div className="flex flex-row items-center justify-end gap-1 w-full min-w-[104px] h-[20px] relative">
              <Download className="w-[1.125rem] h-[1.125rem]" />
              <div className="flex flex-row gap-1">
                <span className="font-urbanist font-medium text-xs leading-[20px] text-[var(--listing-muted-text)]">{resource?.downloads}</span>
                <span className="font-urbanist font-medium text-xs leading-[20px] text-[var(--listing-muted-text)]">Downloads</span>
              </div>
            </div>
          ) : (
            <div className="min-h-[20px]" />
          )}
        </div>
        {/* Organization block */}
        {resource?.organization && (
          <button
            className="cursor-pointer flex flex-row items-center gap-1.5 w-full h-[30.25px] max-w-[320px] hover:text-[var(--listing-secondary)] transition-colors"
            title={resource?.organization}
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              window.open(resource?.organization_url, "_blank")
            }}
          >
            <img src={resource?.org_logo} alt="Shikshagraha Logo" className="h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
