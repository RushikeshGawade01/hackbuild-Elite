import { Card, Stat, Pill } from "../components/UI";
import { campaigns, monthlySpend } from "../data/mock";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Play, PlusCircle, Import, Wand2, Loader2, Download, Eye, Settings } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import gsap from "gsap";

const statusColor = (s) =>
  s === "Running" ? "text-green-600 bg-green-50" : s === "Paused" ? "text-yellow-600 bg-yellow-50" : "text-gray-600 bg-gray-50";

export default function CampaignHub() {
  const [filters, setFilters] = useState({ platform: "All", perf: "All" });
  const [formData, setFormData] = useState({
    productName: "",
    targetAudience: "",
    budgetRange: "",
    platform: "Meta",
    aiLevel: "AI: Copy + Visuals + Targeting"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAds, setGeneratedAds] = useState([]);
  const [showAdsModal, setShowAdsModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [placidApiKey, setPlacidApiKey] = useState("");
  const [placidTemplate, setPlacidTemplate] = useState("");

  // Animation refs
  const actionsRef = useRef();
  const formRef = useRef();
  const statsRef = useRef();
  const filtersRef = useRef();
  const tableRef = useRef();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('placid_api_key');
    const savedTemplate = localStorage.getItem('placid_template_id');
    if (savedApiKey) setPlacidApiKey(savedApiKey);
    if (savedTemplate) setPlacidTemplate(savedTemplate);
  }, []);

  useEffect(() => {
    gsap.fromTo(actionsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(statsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(filtersRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" });
    gsap.fromTo(tableRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" });
  }, []);

  const filtered = useMemo(() => {
    return campaigns.filter(c => (filters.platform === "All" || c.platform === filters.platform));
  }, [filters]);

  const avgRoi = Math.round(filtered.reduce((a, c) => a + c.roi, 0) / (filtered.length || 1));

  // Placid API Integration
  const generateAdWithPlacid = async (templateData) => {
    if (!placidApiKey) {
      throw new Error("Placid API key not configured");
    }

    try {
      const response = await fetch(`https://api.placid.app/api/rest/${placidTemplate}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${placidApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          create_now: true,
          modifications: templateData
        })
      });

      if (!response.ok) {
        throw new Error(`Placid API error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.image_url;
    } catch (error) {
      console.error('Placid API error:', error);
      throw error;
    }
  };

  // Generate multiple ad variations
  const generateAdImages = async () => {
    const variations = [
      {
        product_name: formData.productName,
        audience: formData.targetAudience,
        platform: formData.platform,
        call_to_action: "Shop Now",
        color_scheme: "primary"
      },
      {
        product_name: formData.productName,
        audience: formData.targetAudience,
        platform: formData.platform,
        call_to_action: "Learn More",
        color_scheme: "secondary"
      },
      {
        product_name: formData.productName,
        audience: formData.targetAudience,
        platform: formData.platform,
        call_to_action: "Get Started",
        color_scheme: "accent"
      }
    ];

    const imagePromises = variations.map(variation => 
      generateAdWithPlacid(variation).catch(error => {
        console.error('Failed to generate variation:', error);
        return null;
      })
    );

    const results = await Promise.all(imagePromises);
    return results.filter(url => url !== null);
  };

  // Fallback image generation for demo purposes
  const generateFallbackImages = () => {
    return [
      `https://via.placeholder.com/512x512/3B82F6/FFFFFF?text=${encodeURIComponent(formData.productName)}`,
      `https://via.placeholder.com/512x512/10B981/FFFFFF?text=${encodeURIComponent(formData.productName)}`,
      `https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=${encodeURIComponent(formData.productName)}`
    ];
  };

  // Generate Campaign Handler
  const handleGenerateCampaign = async () => {
    if (!formData.productName || !formData.targetAudience) {
      alert("Please fill in product name and target audience");
      return;
    }

    if (!placidApiKey || !placidTemplate) {
      alert("Please configure Placid API key and template ID in settings");
      setShowApiModal(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      let images;
      
      try {
        console.log("Generating ads with Placid API...");
        images = await generateAdImages();
        
        if (images.length === 0) {
          throw new Error("No images generated from Placid API");
        }
      } catch (placidError) {
        console.error("Placid API failed, using fallback:", placidError);
        images = generateFallbackImages();
      }

      // Create campaign data
      const newCampaign = {
        id: Date.now(),
        name: `${formData.productName} Campaign`,
        platform: formData.platform,
        status: "Draft",
        budget: parseInt(formData.budgetRange.split('-')[0]) * 1000 || 5000,
        roi: Math.floor(Math.random() * 100) + 50,
        score: Math.floor(Math.random() * 3) + 7,
        images: images,
        createdAt: new Date().toISOString(),
        audience: formData.targetAudience,
        aiLevel: formData.aiLevel
      };

      setGeneratedAds([newCampaign]);
      setShowAdsModal(true);
      
      console.log("Campaign generated successfully:", newCampaign);
      
    } catch (error) {
      console.error("Campaign generation failed:", error);
      alert(`Failed to generate campaign: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // API Configuration Handler
  const handleSaveApiConfig = () => {
    if (!placidApiKey.trim()) {
      alert("Please enter a valid Placid API key");
      return;
    }
    
    if (!placidTemplate.trim()) {
      alert("Please enter a valid Placid template ID");
      return;
    }

    localStorage.setItem('placid_api_key', placidApiKey);
    localStorage.setItem('placid_template_id', placidTemplate);
    setShowApiModal(false);
    alert("API configuration saved successfully!");
  };

  // Form input handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Download image handler
  const handleDownloadImage = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ad-creative-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try right-clicking and selecting "Save Image As"');
    }
  };

  // View image handler
  const handleViewImage = (imageUrl, index) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Campaign Hub</h1>
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-xl hover:bg-gray-50"
          >
            <Settings size={16} />
            API Settings
          </button>
        </div>

        {/* Quick Actions */}
        <div ref={actionsRef} className="grid md:grid-cols-3 gap-4">
          <button className="flex items-center gap-2 justify-center rounded-2xl border bg-white p-4 hover:bg-gray-50">
            <Wand2 size={18}/> Generate from competitor analysis
          </button>
          <button className="flex items-center gap-2 justify-center rounded-2xl border bg-white p-4 hover:bg-gray-50">
            <PlusCircle size={18}/> Create custom campaign
          </button>
          <button className="flex items-center gap-2 justify-center rounded-2xl border bg-white p-4 hover:bg-gray-50">
            <Import size={18}/> Import for optimization
          </button>
        </div>

        {/* AI Campaign Generation Form */}
        <Card ref={formRef} className="mt-5">
          <div className="grid md:grid-cols-5 gap-4">
            <input 
              className="border rounded-xl px-3 py-2" 
              placeholder="Product name / category"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
            />
            <input 
              className="border rounded-xl px-3 py-2" 
              placeholder="Target audience"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            />
            <input 
              className="border rounded-xl px-3 py-2" 
              placeholder="Budget range (e.g. 5k-20k)"
              value={formData.budgetRange}
              onChange={(e) => handleInputChange('budgetRange', e.target.value)}
            />
            <select 
              className="border rounded-xl px-3 py-2"
              value={formData.platform}
              onChange={(e) => handleInputChange('platform', e.target.value)}
            >
              <option>Meta</option>
              <option>Google</option>
              <option>LinkedIn</option>
            </select>
            <select 
              className="border rounded-xl px-3 py-2"
              value={formData.aiLevel}
              onChange={(e) => handleInputChange('aiLevel', e.target.value)}
            >
              <option>AI: Copy + Visuals + Targeting</option>
              <option>AI: Copy only</option>
              <option>AI: Targeting only</option>
            </select>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {placidApiKey ? "✅ Placid API configured" : "⚠️ Configure Placid API to generate ads"}
            </div>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateCampaign}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin"/> Generating...
                </>
              ) : (
                <>
                  <Play size={16}/> Generate Campaign
                </>
              )}
            </button>
          </div>
        </Card>

        {/* Stats */}
        <div ref={statsRef} className="grid md:grid-cols-4 gap-4 mt-6">
          <Stat label="Total Campaigns" value={filtered.length} sub="+2 this month"/>
          <Stat label="Average ROI" value={`${avgRoi}%`} sub="↑ vs last month"/>
          <Stat label="Best Platform" value="Google" sub="ROI 148%, CPC $2.6"/>
          <Card>
            <div className="text-sm text-gray-500 mb-2">Monthly spend vs last month</div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <Tooltip/>
                  <Line type="monotone" dataKey="spend" strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="flex items-center gap-3 mt-8">
          <select
            className="border rounded-xl px-3 py-2 bg-white"
            value={filters.platform}
            onChange={(e) => setFilters(f => ({...f, platform: e.target.value}))}
          >
            <option>All</option><option>Meta</option><option>Google</option><option>LinkedIn</option>
          </select>
          <select
            className="border rounded-xl px-3 py-2 bg-white"
            value={filters.perf}
            onChange={(e) => setFilters(f => ({...f, perf: e.target.value}))}
          >
            <option>All</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>

        {/* Table */}
        <Card ref={tableRef} className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Name</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Budget</th>
                <th>ROI%</th>
                <th>Success Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="[&>tr:not(:last-child)]:border-b">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="py-2 font-medium">{row.name}</td>
                  <td>{row.platform}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>${row.budget.toLocaleString()}</td>
                  <td>{row.roi}%</td>
                  <td>{row.score}/10</td>
                  <td className="space-x-2">
                    <Pill>Pause</Pill>
                    <Pill>Optimize</Pill>
                    <Pill>View</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* API Configuration Modal */}
        {showApiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Placid API Configuration</h2>
                  <button 
                    onClick={() => setShowApiModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Placid API Key
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded-xl px-3 py-2"
                      placeholder="Enter your Placid API key"
                      value={placidApiKey}
                      onChange={(e) => setPlacidApiKey(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template ID
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-xl px-3 py-2"
                      placeholder="Enter your Placid template ID"
                      value={placidTemplate}
                      onChange={(e) => setPlacidTemplate(e.target.value)}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>• Get your API key from <a href="https://placid.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">placid.app</a></p>
                    <p>• Create a template and copy its ID</p>
                    <p>• Your credentials are stored locally in your browser</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setShowApiModal(false)}
                    className="px-4 py-2 text-gray-600 border rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveApiConfig}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Ads Modal */}
        {showAdsModal && generatedAds.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Generated Ad Creatives</h2>
                  <button 
                    onClick={() => setShowAdsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                {generatedAds.map(campaign => (
                  <div key={campaign.id} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">{campaign.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {campaign.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Ad creative ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/512x512/6B7280/FFFFFF?text=Failed+to+Load`;
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleDownloadImage(image, index)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                              <button 
                                onClick={() => handleViewImage(image, index)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                                title="View Full Size"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setShowAdsModal(false)}
                    className="px-4 py-2 text-gray-600 border rounded-xl hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}