import { useState } from 'react';
import { ArrowLeft, Sparkles, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminImageGeneratorProps {
  onBack: () => void;
}

const AdminImageGenerator = ({ onBack }: AdminImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [highQuality, setHighQuality] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, highQuality }
      });

      if (error) throw error;

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success('Image generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const samplePrompts = [
    'A beautiful sunset over mountains with golden light',
    'Abstract geometric patterns in purple and gold',
    'A cute cartoon mascot for a chat app',
    'Professional business team meeting illustration',
    'Elegant floral pattern for background design',
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">AI Image Generator</h1>
      </div>

      {/* Prompt Input */}
      <div className="glass-card p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Enter your prompt</Label>
          <Input
            id="prompt"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="high-quality"
              checked={highQuality}
              onCheckedChange={setHighQuality}
            />
            <Label htmlFor="high-quality" className="text-sm text-muted-foreground">
              High Quality (slower)
            </Label>
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sample Prompts */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Try these prompts:</p>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, i) => (
            <button
              key={i}
              onClick={() => setPrompt(sample)}
              className="px-3 py-1.5 text-xs bg-secondary rounded-full hover:bg-secondary/80 transition-colors text-foreground"
            >
              {sample.slice(0, 30)}...
            </button>
          ))}
        </div>
      </div>

      {/* Generated Image */}
      {generatedImage && (
        <div className="glass-card p-4 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Generated Image</h3>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden bg-secondary">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="text-primary animate-pulse" size={32} />
          </div>
          <p className="text-muted-foreground">Creating your masterpiece...</p>
        </div>
      )}
    </div>
  );
};

export default AdminImageGenerator;
