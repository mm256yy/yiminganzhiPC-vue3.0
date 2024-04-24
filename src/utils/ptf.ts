import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
/**
 * html转pdf
 * @param dom 节点
 * @param name 文件名称
 */
export const htmlToPdf = (dom = '', name = '无', centen = true) => {
  return new Promise((resolve, reject) => {
    const value = document.querySelector(dom) as HTMLElement
    html2canvas(value, {
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const contentWidth = canvas.width
      const contentHeight = canvas.height
      const pageHeight = centen
        ? (contentWidth / 841.89) * 595.28
        : (contentWidth / 595.28) * 841.89
      let leftHeight = contentHeight
      let position = 0
      const imgWidth = centen ? 841.89 : 595.28
      const imgHeight = centen
        ? (841.89 / contentWidth) * contentHeight
        : (595.28 / contentWidth) * contentHeight

      const pageData = canvas.toDataURL('image/jpeg', 1.0)
      const landscape = centen ? 'landscape' : 'portrait'
      const pdf = new jsPDF(landscape, 'pt', 'a4')
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          console.log(leftHeight, pageHeight)

          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 595.28
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage()
          }
        }
      }

      pdf.save(name)
      const pdfData = pdf.output('datauristring') //获取base64Pdf
      resolve(pdfData)
    })
  })
}
