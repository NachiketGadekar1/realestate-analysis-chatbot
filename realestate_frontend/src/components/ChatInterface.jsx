import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Navbar } from 'react-bootstrap';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChatInterface = () => {
    const [query, setQuery] = useState('');
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:8000/api/analyze/';

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query) {
            setError('Please enter a location to analyze.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            let result;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('query', query);
                result = await axios.post(API_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                result = await axios.post(API_URL, { query });
            }
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!response || !response.table || response.table.length === 0) return;

        const headers = Object.keys(response.table[0]);
        const csvRows = [
            headers.join(','),
            ...response.table.map(row =>
                headers.map(fieldName => JSON.stringify(row[fieldName])).join(',')
            )
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${query}_analysis.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <header className="app-header">
                <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
                    <Container>
                        <Navbar.Brand href="#home">
                            <i className="bi bi-graph-up-arrow me-2"></i>
                            Real Estate Analyzer
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            </header>

            <Container className="pt-5 pb-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={10}> {/* Increased lg from 8 to 10 */}
                        <Card className="card-custom mb-4">
                            <Card.Body>
                                <Card.Title className="mb-3">Start Your Analysis</Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Location Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Wakad"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            disabled={loading}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Custom Data (Optional)</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                            accept=".xlsx, .xls"
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-2">
                                        {loading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Analyzing...</> : 'Analyze'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        
                        {error && <Alert variant="danger">{error}</Alert>}

                        {response && (
                            <Card className="card-custom mt-4">
                                <Card.Body>
                                    <Card.Title>Analysis for: {query}</Card.Title>
                                    <p className="lead">{response.summary}</p>

                                    {response.chartData && response.chartData.years.length > 0 && (
                                        <div className="mt-4">
                                            <h5>Price & Demand Trends</h5>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={response.chartData.years.map((year, index) => ({
                                                        year,
                                                        price: response.chartData.price[index],
                                                        demand: response.chartData.demand[index],
                                                    }))}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis yAxisId="left" label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
                                                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Demand', angle: -90, position: 'insideRight' }} />
                                                    <Tooltip formatter={(value, name) => [name === 'price' ? `₹${value}` : value, name]}/>
                                                    <Legend />
                                                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" name="Avg. Price" />
                                                    <Line yAxisId="right" type="monotone" dataKey="demand" stroke="#82ca9d" name="Units Sold" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {response.table && response.table.length > 0 && (
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5>Detailed Data</h5>
                                                <Button variant="success" size="sm" onClick={downloadCSV}>
                                                    <i className="bi bi-download me-2"></i>Download CSV
                                                </Button>
                                            </div>
                                            <div className="mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <table className="table table-striped table-hover table-sm"> {/* Added table-sm for compactness */}
                                                    <thead>
                                                        <tr>
                                                            {Object.keys(response.table[0]).map((key) => (
                                                                <th key={key} className="text-nowrap text-center" style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>{key.replace(/_/g, ' ')}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {response.table.map((row, index) => (
                                                            <tr key={index}>
                                                                {Object.values(row).map((value, i) => (
                                                                    <td key={i} className={typeof value === 'number' ? 'text-end' : 'text-start'}>
                                                                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ChatInterface;