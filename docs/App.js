import SnipCanvas from './SnipCanvas';
import Tesseract from 'tesseract.js';

function App() {
  const [imgURL, setImgURL] = useState(null);
  const [snip, setSnip] = useState(null);
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFile = e => setImgURL(URL.createObjectURL(e.target.files[0]));

  const onSnip = dataUrl => {
    setSnip(dataUrl);
    setText('');
    Tesseract.recognize(dataUrl, 'eng', {
      logger: m => m.status === 'recognizing text' && setProgress(m.progress)
    }).then(({ data: { text } }) => setText(text));
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      {imgURL && <SnipCanvas image={imgURL} onSnip={onSnip} />}
      {progress > 0 && progress < 1 && <p>OCR: {(progress * 100).toFixed(0)}%</p>}
      {text && (
        <textarea rows="10" value={text} onChange={e => setText(e.target.value)} style={{width:'100%'}} />
      )}
    </div>
  );
}
