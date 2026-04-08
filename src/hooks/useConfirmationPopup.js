import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"

export const useConfirmationPopup = () => {
  const { t } = useTranslation("popup")

  const showGuestPopup = async (yesButtonAction, noButtonAction) => {
    const result = await Swal.fire({
      title: t("popup:guestPopUpChanges"),
      showCancelButton: true,
      confirmButtonText: t("popup:confirmChanges"),
      cancelButtonText: t("popup:denyButton"),
    })

    if (result.isConfirmed && yesButtonAction) {
      yesButtonAction()
    } else if (noButtonAction) {
      noButtonAction()
    }
  }

  const showConfirmationPopup = async (yesButtonAction, noButtonAction) => {
    const result = await Swal.fire({
      title: t("popup:popUpChanges"),
      showCancelButton: true,
      confirmButtonText: t("popup:confirmChanges"),
      cancelButtonText: t("popup:denyButton"),
    })

    if (result.isConfirmed && yesButtonAction) {
      yesButtonAction()
    } else if (result.isConfirmed === false && noButtonAction) {
      noButtonAction()
    }
  }

  const commonsNetworkReconnectionPopup = async (yesButtonAction, noButtonAction) => {
    const result = await Swal.fire({
      title: t("popup:popUpChanges"),
      showCancelButton: true,
      confirmButtonText: t("popup:confirmChanges"),
      cancelButtonText: t("popup:denyButton"),
      buttonsStyling: true,
      customClass: {
        confirmButton: "bg-[var(--primary-color)]",
        cancelButton: "bg-white text-[var(--primary-color)] shadow-[0_2px_6px_#0003]"
      }
    })

    if (result.isConfirmed && yesButtonAction) {
      yesButtonAction()
    } else if (result.isConfirmed === false && noButtonAction) {
      noButtonAction()
    }
  }

  return {
    showGuestPopup,
    showConfirmationPopup,
    commonsNetworkReconnectionPopup
  }

}
