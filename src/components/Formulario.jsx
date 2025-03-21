import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf'; // Importar jsPDF
import '../css/Formulario.css';
import logo from '../images/milalogo.jpg';

const Formulario = () => {
  const [formData, setFormData] = useState({
    apellido: '',
    oficina: '',
    mesPago: '',
    total: '',
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let validationErrors = {};
    const requiredFields = ['apellido', 'oficina', 'mesPago', 'total'];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = 'Este campo es obligatorio';
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await generarPDF(); // Llamar generarPDF directamente
  };

  const generarPDF = () => {
    buttonRef.current.style.display = 'none';

    const doc = new jsPDF();

    // Obtener el tamaño de la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Agregar marca de agua en el fondo (Logo centrado y con transparencia)
    const logoWidth = 100; // Ancho del logo de marca de agua
    const logoHeight = 50; // Alto del logo de marca de agua
    const logoX = (pageWidth - logoWidth) / 2; // Centrar en X
    const logoY = (pageHeight - logoHeight) / 2; // Centrar en Y
    doc.setGState(new doc.GState({ opacity: 0.15 })); // Reducir opacidad
    doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    doc.setGState(new doc.GState({ opacity: 1 })); // Restaurar opacidad para el resto del contenido

    // Agregar el logo en la parte superior
    //doc.addImage(logo, 'JPEG', 80, 10, 50, 20); // Centrado en el ancho

    // Título estilizado
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('COMPROBANTE DE PAGO', 105, 40, { align: "center" });

    // Dibujar un recuadro alrededor del contenido
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 50, 190, 60); // (x, y, width, height)

    // Obtener la fecha actual en formato dd/mm/yyyy
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const año = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;

    // Estilo para los datos del comprobante
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Detalles del Pago:', 15, 60);
    doc.text(fechaFormateada, 185, 60, { align: "right" }); // Fecha alineada a la derecha

    // Datos dentro del recuadro con separador en Nombre y Apellido
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre y Apellido: ${formData.apellido}`, 15, 75);
    doc.text(`Oficina: ${formData.oficina}`, 15, 85);
    doc.text(`Mes de Pago: ${formData.mesPago}`, 15, 95);
    doc.text(`Total Abonado: $${formData.total}`, 15, 105);

    // Generar nombre de archivo dinámico
    const { apellido, oficina, mesPago } = formData;
    const nombreArchivo = `${oficina}-${apellido}-${mesPago}-${año}.pdf`;

    // Guardar y descargar el PDF
    doc.save(nombreArchivo);

    buttonRef.current.style.display = 'block';
};

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src={logo} alt="Logo Hotel Raglan" />
        </div>
        <h2>Comprobante de Pago</h2>
        
        <div className="form-group">
          <label>Nombre y Apellido</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
          {errors.apellido && <span className="error">{errors.apellido}</span>}
        </div>

        <div className="form-group">
          <label>Oficina</label>
          <input type="text" name="oficina" value={formData.oficina} onChange={handleChange} required />
          {errors.oficina && <span className="error">{errors.oficina}</span>}
        </div>

        <div className="form-group">
          <label>Mes de Pago</label>
          <select name="mesPago" value={formData.mesPago} onChange={handleChange} required>
            <option value="">Seleccione un mes</option>
            <option value="enero">Enero</option>
            <option value="febrero">Febrero</option>
            <option value="marzo">Marzo</option>
            <option value="abril">Abril</option>
            <option value="mayo">Mayo</option>
            <option value="junio">Junio</option>
            <option value="julio">Julio</option>
            <option value="agosto">Agosto</option>
            <option value="septiembre">Septiembre</option>
            <option value="octubre">Octubre</option>
            <option value="noviembre">Noviembre</option>
            <option value="diciembre">Diciembre</option>
          </select>
          {errors.mesPago && <span className="error">{errors.mesPago}</span>}
        </div>

        <div className="form-group">
          <label>Total Abonado $</label>
          <input type="number" name="total" value={formData.total} onChange={handleChange} required />
          {errors.total && <span className="error">{errors.total}</span>}
        </div>

        <button ref={buttonRef} type="submit">Descargar Comprobante</button>
      </form>

      <style jsx>{`
        .logo-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-container img {
          max-width: 250px;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .error {
          color: red;
          font-size: 12px;
        }

        button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </>
  );
};

export default Formulario;
