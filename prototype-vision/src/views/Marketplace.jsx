import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Marketplace() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/v1/marketplace/suppliers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuppliers(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>A carregar fornecedores...</div>;
  }

  if (error) {
    return <div>Erro ao carregar fornecedores: {error}</div>;
  }

  return (
    <div className="marketplace-container">
      <h1>Diretório de Fornecedores</h1>
      <p>Encontre os melhores parceiros para o seu restaurante em Portugal.</p>

      <div className="suppliers-grid">
        {suppliers.length > 0 ? (
          suppliers.map(supplier => (
            <div key={supplier.id} className="supplier-card">
              <img src={supplier.logoUrl || 'https://via.placeholder.com/150'} alt={supplier.companyName} className="supplier-logo" />
              <h2>{supplier.companyName}</h2>
              <p>{supplier.description}</p>
              <p>Categorias: {supplier.categories.join(', ')}</p>
              <p>Localização: {supplier.locationCity} ({supplier.locationRegion})</p>
              <p>Avaliação: {supplier.ratingAvg || 'N/A'} ({supplier.reviewCount || 0} reviews)</p>
              <Link to={`/marketplace/suppliers/${supplier.id}`} className="mt-4 inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Ver Catálogo
              </Link>
            </div>
          ))
        ) : (
          <p>Nenhum fornecedor encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
