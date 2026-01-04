import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SupplierDetail() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/v1/marketplace/suppliers/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSupplier(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (loading) {
    return <div>A carregar detalhes do fornecedor...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!supplier) {
    return <div>Fornecedor não encontrado.</div>;
  }

  return (
    <div className="supplier-detail-container p-6">
      <div className="supplier-header mb-6">
        <img src={supplier.logoUrl || 'https://via.placeholder.com/150'} alt={supplier.companyName} className="h-24 w-24 object-contain rounded-md mr-6" />
        <div>
          <h1 className="text-3xl font-bold">{supplier.companyName}</h1>
          <p className="text-lg text-gray-600">{supplier.description}</p>
          <p className="text-sm text-gray-500">Avaliação: {supplier.ratingAvg} ({supplier.reviewCount} reviews)</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Catálogo de Produtos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supplier.SupplierProducts && supplier.SupplierProducts.length > 0 ? (
          supplier.SupplierProducts.map((supplierProduct) => (
            <div key={supplierProduct.Product.id} className="product-card border rounded-lg p-4 shadow-sm">
              <img src={supplierProduct.Product.imageUrl || 'https://via.placeholder.com/150'} alt={supplierProduct.Product.name} className="h-40 w-full object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold">{supplierProduct.Product.name}</h3>
              <p className="text-gray-600">{supplierProduct.Product.description}</p>
              <p className="mt-2 font-bold text-lg">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(supplierProduct.price)} / {supplierProduct.unit || supplierProduct.Product.unit}</p>
            </div>
          ))
        ) : (
          <p>Este fornecedor ainda não tem produtos no seu catálogo.</p>
        )}
      </div>
    </div>
  );
}

export default SupplierDetail;
