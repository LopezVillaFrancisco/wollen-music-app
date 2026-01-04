import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ExportButton.css';

interface ExportButtonProps {
  data: unknown;
  filename: string;
  label?: string;
  type?: 'tracks' | 'genres' | 'artist' | 'trends';
  artistName?: string;
  title?: string;
}

export const ExportButton = ({ data, filename, label = 'Exportar Datos', type = 'tracks', artistName, title: customTitle }: ExportButtonProps) => {
  const exportToPDF = () => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      alert('No hay datos para exportar');
      return;
    }

    const items = Array.isArray(data) ? data : [data];
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    let headers: string[] = [];
    let rows: string[][] = [];
    let title = '';

    if (type === 'trends') {
      const genreName = items[0]?.genre || 'Género';
      title = `Tendencias de ${genreName} a través de los años`;
      headers = ['Año', 'Cantidad de Tracks'];
      rows = items.map((item) => [
        String(item.year || 'N/A'),
        String(item.count || '0'),
      ]);
    } else if (type === 'genres') {
      title = 'Top Géneros Musicales';
      headers = ['#', 'Género', 'Popularidad', 'Estado'];
      rows = items.map((item, index) => [
        String(index + 1),
        String(item.name || 'N/A'),
        String(item.count || item.reach || item.taggings || 'N/A'),
        'Popular'
      ]);
    } else {
      title = customTitle || (artistName ? `Top Tracks de ${artistName}` : 'Top Tracks Globales');
      headers = ['#', 'Canción', 'Artista', 'Duración', 'Oyentes', 'Reproducciones'];
      rows = items.map((item, index) => {
        const artist = typeof item.artist === 'object' && item.artist !== null
          ? (item.artist as { name: string }).name
          : String(item.artist || 'N/A');
        
        const duration = item.duration 
          ? `${Math.floor(Number(item.duration) / 60)}:${String(Math.floor(Number(item.duration) % 60)).padStart(2, '0')}` 
          : 'N/A';
        const listeners = item.listeners ? Number(item.listeners).toLocaleString('es-ES') : 'N/A';
        const playcount = item.playcount ? Number(item.playcount).toLocaleString('es-ES') : 'N/A';
        
        return [
          String(index + 1),
          String(item.name || 'N/A'),
          artist,
          duration,
          listeners,
          playcount
        ];
      });
    }

    doc.text(title, 40, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, 40, 60);

    // @ts-expect-error - autoTable plugin augments jsPDF
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 80,
      styles: { 
        fontSize: 9,
        cellPadding: 5,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: { 
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: type === 'genres' ? {
        0: { halign: 'center', cellWidth: 40 },
        1: { cellWidth: 200 },
        2: { halign: 'right', cellWidth: 120 },
        3: { halign: 'center', cellWidth: 100 }
      } : type === 'trends' ? {
        0: { halign: 'center', cellWidth: 120 },
        1: { halign: 'center', cellWidth: 150 },
        2: { halign: 'center', cellWidth: 180 }
      } : {
        0: { halign: 'center', cellWidth: 30 },
        1: { cellWidth: 150 },
        2: { cellWidth: 120 },
        3: { halign: 'center', cellWidth: 60 },
        4: { halign: 'right', cellWidth: 70 },
        5: { halign: 'right', cellWidth: 90 }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 80, left: 40, right: 40 }
    });

    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  return (
    <div className="export-button-container">
      <button className="export-button export-button-pdf" onClick={exportToPDF}>
        <Download size={18} />
        <span>{label} (PDF)</span>
      </button>
    </div>
  );
};
