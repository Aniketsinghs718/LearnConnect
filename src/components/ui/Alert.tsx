// Alert component for messages
interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const styles = {
    error: 'bg-red-500/20 border-red-500/50',
    success: 'bg-green-500/20 border-green-500/50'
  };

  return (
    <div className={`mb-4 p-4 backdrop-blur-lg rounded-lg border ${styles[type]}`}>
      <p className="text-white text-sm">{message}</p>
    </div>
  );
}
