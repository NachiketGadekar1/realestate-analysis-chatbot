import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChatInterface = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:8000/api/analyze/'; // Backend API endpoint

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await axios.post(API_URL, { query });
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Real Estate Analysis Chatbot</h1>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Form onSubmit={handleSubmit} className="mb-4">
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="e.g., Analyze Wakad"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? <Spinner animation="border" size="sm" /> : 'Analyze'}
                        </Button>
                    </Form>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {response && (
                        <Card className="mt-4">
                            <Card.Body>
                                <Card.Title>Summary</Card.Title>
                                <Card.Text>{response.summary}</Card.Text>

                                {response.chartData && response.chartData.years.length > 0 && (
                                    <>
                                        <Card.Title className="mt-4">Price & Demand Trends</Card.Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                data={response.chartData.years.map((year, index) => ({
                                                    year,
                                                    price: response.chartData.price[index],
                                                    demand: response.chartData.demand[index],
                                                }))}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="year" />
                                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                                <Tooltip />
                                                <Legend />
                                                <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
                                                <Line yAxisId="right" type="monotone" dataKey="demand" stroke="#82ca9d" name="Demand" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </>
                                )}

                                {response.table && response.table.length > 0 && (
                                    <>
                                        <Card.Title className="mt-4">Detailed Data</Card.Title>
                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(response.table[0]).map((key) => (
                                                            <th key={key}>{key.replace(/_/g, ' ')}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {response.table.map((row, index) => (
                                                        <tr key={index}>
                                                            {Object.values(row).map((value, i) => (
                                                                <td key={i}>{typeof value === 'number' ? value.toFixed(2) : value}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ChatInterface;
