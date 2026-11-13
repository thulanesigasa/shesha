import {PDFDocument} from 'pdf-lib';
export async function carouselPdf(pages){const pdf=await PDFDocument.create();for(const data of pages){const image=await pdf.embedJpg(data.split(',')[1]);const page=pdf.addPage([1080,1350]);page.drawImage(image,{x:0,y:0,width:1080,height:1350});}return pdf.save();}
